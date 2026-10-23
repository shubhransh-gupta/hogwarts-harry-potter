// Dialog Manager: Displays Courier City style bilingual NPC dialogues and toasts
// Features Devanagari script + English translation

export class DialogManager {
  constructor() {
    this.talkEl = document.getElementById('talk');
    this.whoEl = this.talkEl?.querySelector('.k-who');
    this.nativeEl = this.talkEl?.querySelector('.k-native');
    this.englishEl = this.talkEl?.querySelector('.k-english');

    this.toastEl = document.getElementById('toast');
    this.toastDevaEl = this.toastEl?.querySelector('.t-deva');
    this.toastLatinEl = this.toastEl?.querySelector('.t-latin');

    this.promptEl = document.getElementById('prompt');

    this.dialogTimeout = null;
    this.toastTimeout = null;
  }

  showDialog(dialog) {
    if (!this.talkEl || !dialog) return;

    if (this.whoEl) this.whoEl.textContent = dialog.who || '';
    if (this.nativeEl) this.nativeEl.textContent = dialog.native || '';
    if (this.englishEl) this.englishEl.textContent = dialog.english || '';

    this.talkEl.classList.add('show');

    if (this.dialogTimeout) clearTimeout(this.dialogTimeout);
    this.dialogTimeout = setTimeout(() => {
      this.hideDialog();
    }, 6000);
  }

  hideDialog() {
    if (this.talkEl) {
      this.talkEl.classList.remove('show');
    }
  }

  showToast(devaText, latinText, duration = 3500) {
    if (!this.toastEl) return;

    if (this.toastDevaEl) this.toastDevaEl.textContent = devaText;
    if (this.toastLatinEl) this.toastLatinEl.textContent = latinText;

    this.toastEl.classList.add('show');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, duration);
  }

  setPrompt(text) {
    if (!this.promptEl) return;
    if (text) {
      this.promptEl.innerHTML = text;
      this.promptEl.classList.add('show');
    } else {
      this.promptEl.classList.remove('show');
    }
  }
}
