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

  // Grand Story Prologue Modal: The 7 Horcruxes & Lord Voldemort's Curse
  showStoryPrologue(onDismiss) {
    const existing = document.querySelector('.prologue-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'prologue-modal-overlay';
    overlay.innerHTML = `
      <div class="prologue-modal-card">
        <div class="pm-sigil">⚡ 🐍 ⚡</div>
        <h2 class="pm-title">द हॉरक्रक्स भविष्यवाणी · The 7 Horcruxes Prophecy</h2>
        <div class="pm-subtitle">Lord Voldemort Has Risen — Destroy His Soul Fragments to Finish Him!</div>
        
        <div class="pm-narrative">
          <p>
            <strong>The Dark Lord Voldemort has cheated death.</strong> In his quest for immortality, he tore his living soul into <strong>seven cursed Horcruxes</strong>, concealing them across Lucknow Platform 9¾, the Great Hall, the depths of the Black Lake, the high Astronomy Spire, and the Forbidden Deodar Forest.
          </p>
          <p class="pm-highlight">
            <em>"As long as even one Horcrux remains intact on this earth, Lord Voldemort cannot die..."</em>
          </p>
          <div class="pm-steps-grid">
            <div class="pm-step">
              <span class="pms-num">1</span>
              <div>
                <strong>Track the 7 Horcruxes</strong>
                <p>Use your top-left Tracker Dropdown to hunt Tom Riddle's Diary, Marvolo's Ring, Slytherin's Locket, Hufflepuff's Cup, Ravenclaw's Diadem, Nagini, and Voldemort.</p>
              </div>
            </div>
            <div class="pm-step">
              <span class="pms-num">2</span>
              <div>
                <strong>Engage in Magic Duels</strong>
                <p>Approach each cursed relic and strike its dark wards with wand spells (Left-Click or [E] interact). Shatter its 3 HP shield!</p>
              </div>
            </div>
            <div class="pm-step">
              <span class="pms-num">3</span>
              <div>
                <strong>Relive Voldemort's Murder Visions</strong>
                <p>Each severed Horcrux reveals a horrifying memory of the exact murder Voldemort committed to create it.</p>
              </div>
            </div>
            <div class="pm-step">
              <span class="pms-num">4</span>
              <div>
                <strong>Unlock Forbidden Magic & Slay the Dark Lord</strong>
                <p>Open Enchanted Mystery Boxes to learn Avada Kedavra and Expelliarmus for the final Courtyard climax!</p>
              </div>
            </div>
          </div>
        </div>

        <button class="pm-begin-btn" id="pm-begin-btn">
          <span>Draw Wand & Begin Quest (मंत्र साधें)</span>
          <span class="btn-arrow">⚔️</span>
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    const beginBtn = overlay.querySelector('#pm-begin-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          if (onDismiss) onDismiss();
        }, 350);
      });
    }
  }

  // Voldemort Killing Memory Vision Modal (Triggered on Horcrux Destruction)
  showVoldemortVision(vision, onDismiss) {
    const existing = document.querySelector('.voldemort-vision-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'voldemort-vision-overlay';
    overlay.innerHTML = `
      <div class="vision-vignette-fx"></div>
      <div class="vision-modal-card">
        <div class="vm-sigil">👁️⚡ DARK MEMORY OF LORD VOLDEMORT ⚡👁️</div>
        <h2 class="vm-horcrux-title" style="color: ${vision.color || '#ffd700'}">${vision.name.toUpperCase()} SEVERED!</h2>
        <div class="vm-memory-title">${vision.memoryTitle}</div>
        <blockquote class="vm-quote">${vision.quote}</blockquote>
        <div class="vm-victim-badge">Victim of the Murder: <b>${vision.victim}</b></div>
        <p class="vm-body">${vision.body}</p>
        
        <div class="vm-footer">
          <button class="vm-dismiss-btn" id="vm-dismiss-btn">
            <span>⚡ Sever the Dark Memory & Continue Quest</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const dismissBtn = overlay.querySelector('#vm-dismiss-btn');
    const dismiss = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        if (onDismiss) onDismiss();
      }, 350);
    };

    if (dismissBtn) {
      dismissBtn.addEventListener('click', dismiss);
    }

    // Auto-dismiss after 9.5 seconds if untouched
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        dismiss();
      }
    }, 9500);
  }
}
