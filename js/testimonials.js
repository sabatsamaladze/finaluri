/* ===================================
   TBILISI BITES — testimonials.js
   Fetches real user avatars from randomuser.me
   and displays testimonials
=================================== */

const GRID = document.getElementById('testimonialsGrid');

const REVIEWS = [
  { text: 'ადჟარული ხაჭაპური საუკეთესო იყო, რაც ოდესმე მიჭამია. ყოველ ვიზიტზე ველი ამ განსაცვიფრებელ გემოს!', stars: 5 },
  { text: 'ქართული სამზარეულო განსაკუთრებულ დონეზეა. ხინკალი ხელნაკეთია, კახური ღვინო — სრულყოფილი.', stars: 5 },
  { text: 'ატმოსფერო ოჯახური, მომსახურება — გულისხმიერი. ჩვენი საყვარელი ადგილი!', stars: 5 },
];

async function loadTestimonials() {
  if (!GRID) return;

  try {
    const res = await fetch('https://randomuser.me/api/?results=3&nat=ge,tr,us');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    GRID.innerHTML = '';

    data.results.forEach((user, i) => {
      const name = `${user.name.first} ${user.name.last}`;
      const avatar = user.picture.medium;
      const stars = '★'.repeat(REVIEWS[i].stars) + '☆'.repeat(5 - REVIEWS[i].stars);

      const card = document.createElement('div');
      card.className = 'testimonial-card reveal';
      card.style.setProperty('--delay', `${i * 0.1}s`);
      card.innerHTML = `
        <div class="testimonial-top">
          <div class="testimonial-avatar">
            <img src="${avatar}" alt="${name}" loading="lazy" />
          </div>
          <div>
            <div class="testimonial-name">${name}</div>
            <div class="testimonial-stars">${stars}</div>
          </div>
        </div>
        <p class="testimonial-text">"${REVIEWS[i].text}"</p>
      `;
      GRID.appendChild(card);
    });

    // Re-trigger reveal observer for newly added elements
    const newReveals = GRID.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    newReveals.forEach(el => obs.observe(el));

  } catch (err) {
    GRID.innerHTML = `
      ${REVIEWS.map((r, i) => `
        <div class="testimonial-card reveal" style="--delay:${i * 0.1}s">
          <div class="testimonial-top">
            <div class="testimonial-avatar" style="background:var(--bg-alt);display:flex;align-items:center;justify-content:center;font-size:1.5rem">👤</div>
            <div>
              <div class="testimonial-name">სტუმარი ${i + 1}</div>
              <div class="testimonial-stars">★★★★★</div>
            </div>
          </div>
          <p class="testimonial-text">"${r.text}"</p>
        </div>
      `).join('')}
    `;
  }
}

loadTestimonials();