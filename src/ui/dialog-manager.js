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

  showInteractiveSorting(onSelectHouse) {
    // Remove any existing modal
    const existing = document.querySelector('.sorting-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'sorting-modal-overlay';
    overlay.innerHTML = `
      <div class="sorting-modal-card">
        <div class="sm-hat-icon">🧙‍♂️</div>
        <h2 class="sm-title">सॉर्टिंग हैट समारोह · The Sorting Hat Ceremony</h2>
        <p class="sm-poem">
          "There's nothing hidden in your head the Sorting Hat can't see, so try me on and I will tell you where you ought to be! Tell me, young wizard: which House does your spirit seek?"
        </p>
        <div class="sm-houses-grid">
          <button class="sm-house-btn gryffindor" data-house="gryffindor">
            <span class="sm-h-icon">🦁</span>
            <span class="sm-h-name">GRYFFINDOR</span>
            <span class="sm-h-trait">Bravery, daring, nerve, and chivalry.</span>
          </button>
          <button class="sm-house-btn slytherin" data-house="slytherin">
            <span class="sm-h-icon">🐍</span>
            <span class="sm-h-name">SLYTHERIN</span>
            <span class="sm-h-trait">Ambition, cunning, resourcefulness.</span>
          </button>
          <button class="sm-house-btn ravenclaw" data-house="ravenclaw">
            <span class="sm-h-icon">🦅</span>
            <span class="sm-h-name">RAVENCLAW</span>
            <span class="sm-h-trait">Wisdom, intelligence, wit, and learning.</span>
          </button>
          <button class="sm-house-btn hufflepuff" data-house="hufflepuff">
            <span class="sm-h-icon">🦡</span>
            <span class="sm-h-name">HUFFLEPUFF</span>
            <span class="sm-h-trait">Loyalty, patience, hard work, and fair play.</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelectorAll('.sm-house-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const house = btn.getAttribute('data-house');
        overlay.remove();
        if (onSelectHouse) onSelectHouse(house);
      });
    });
  }
}
