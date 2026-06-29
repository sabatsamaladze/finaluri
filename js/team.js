/* ===================================
   TBILISI BITES — team.js
   Loads team members via randomuser API
=================================== */

const ROLES = ['მთავარი შეფ-მზარეული', 'სომელიე', 'სარესტორნო მენეჯერი'];
const NAMES = ['ნინო კობახიძე', 'გიორგი მელიქიძე', 'თამარ ჯავახიძე'];
const BIOS = [
  'კულინარიული ხელოვნების 20 წლიანი გამოცდილება ქართულ და ფრანგულ სამზარეულოში.',
  '120-ზე მეტი ქართული ღვინის ექსპერტი, ღვინის სკოლის კურსდამთავრებული.',
  'სტუმართმოყვარეობის 15 წლიანი გამოცდილება, ბედნიერი სტუმრების გარანტი.',
];

const TEAM_GRID = document.getElementById('teamGrid');

async function loadTeam() {
  if (!TEAM_GRID) return;

  try {
    const res = await fetch('https://randomuser.me/api/?results=3&gender=female,male&nat=ge,fr,us');
    if (!res.ok) throw new Error('API fail');
    const data = await res.json();

    TEAM_GRID.innerHTML = '';

    data.results.forEach((user, i) => {
      const avatar = user.picture.large;
      const card = document.createElement('div');
      card.className = 'team-card reveal';
      card.style.setProperty('--delay', `${i * 0.1}s`);
      card.innerHTML = `
        <div class="team-avatar">
          <img src="${avatar}" alt="${NAMES[i]}" loading="lazy" />
        </div>
        <div class="team-name">${NAMES[i]}</div>
        <div class="team-role">${ROLES[i]}</div>
        <p style="font-size:0.85rem">${BIOS[i]}</p>
      `;
      TEAM_GRID.appendChild(card);
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    TEAM_GRID.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  } catch {
    TEAM_GRID.innerHTML = NAMES.map((name, i) => `
      <div class="team-card">
        <div class="team-avatar" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:2rem">👤</div>
        <div class="team-name">${name}</div>
        <div class="team-role">${ROLES[i]}</div>
        <p style="font-size:0.85rem">${BIOS[i]}</p>
      </div>
    `).join('');
  }
}

loadTeam();