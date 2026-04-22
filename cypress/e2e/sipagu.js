describe('Login, Search, and Delete All Found Units (Iterative Search)', () => {

  it('should login, search for "Unit", and delete all matching entries one by one', () => {
    cy.visit('https://sit.stagingapp.dev/login');

    // --- LOGIN STEPS ---
    cy.get('input[name="UserName"]').should('be.visible').type('sipaguuser');
    cy.get('input[name="password"]').should('be.visible').type('password');
    cy.get('input[type="checkbox"]').check().should('be.checked');
    cy.get('button[type="submit"]:contains("Sign in")').should('be.visible').click();
    cy.url().should('include', '/dashboard');
    cy.contains("You're logged in!", { timeout: 10000 }).should('be.visible');

    // --- NAVIGASI KE HALAMAN UNIT ---
    cy.log('Mencoba klik tombol toggle sidebar...');
    cy.get('button[\\@click\\.stop="sidebarToggle = !sidebarToggle"]', { timeout: 10000 })
      .eq(0)
      .click({ force: true });
    cy.wait(2000);

    cy.log('Mengklik "Output" untuk navigasi ke halaman Setting Unit...');
    cy.contains('Output', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.wait(3000); // Tunggu halaman Setting Unit load

    cy.log('Mengklik "Output" untuk navigasi ke halaman Output...');
    cy.contains('Output', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.wait(1000); // Tunggu halaman Output load
    cy.url().should('include', '/output'); // <--- GANTI '/output' DENGAN PATH URL YANG BENAR UNTUK HALAMAN INI
    cy.contains('All List', { timeout: 10000 }).should('be.visible'); // Verifikasi ada teks 'All List'

    // --- KLIK TOMBOL "RINCIAN" (Asumsi klik Rincian di baris pertama) ---
    cy.log('Mengklik tombol "Rincian" di baris pertama...');
    cy.contains('Rincian', { timeout: 10000 }).first().should('be.visible').click(); // <--- KLIK TOMBOL RINCIAN
    cy.wait(1000); // Tunggu halaman/modal "Rincian Output Details" load

    // Verifikasi sudah di halaman/modal detail Rincian Output
    cy.contains('Rincian Output', { timeout: 10000 }).should('be.visible'); // <--- GANTI TEKS INI DENGAN JUDUL HALAMAN/MODAL RINCIAN OUTPUT

    // --- LOOP UNTUK KLIK "ADD DATA" 20 KALI ---
    for (let i = 1; i <= 20; i++) {
      cy.log(`Menambahkan data ke-${i}/20 di Rincian Output`);

      cy.contains('Add Data', { timeout: 10000 }).scrollIntoView().should('be.visible').click();
      cy.wait(1000);

      cy.contains('Tambah Rincian Output Layanan Masyarakat', { timeout: 10000 }).should('be.visible');

      const rincianOutputKode = `${Cypress._.random(1000, 9999)}`;
      const namaRincian = `Nama-${Cypress._.random(1000, 9999)}-${i}`;

      cy.get('input#OutputSubKode', { timeout: 10000 })
        .should('be.visible')
        .should('be.enabled')
        .type(rincianOutputKode);

      cy.get('input#OutputSubNama', { timeout: 10000 })
        .should('be.visible')
        .should('be.enabled')
        .type(namaRincian);

      cy.get('select[wire\\:model="OutputSubStatus"]', { timeout: 10000 }) // <--- UBAH SELECTOR DI SINI
        .should('be.visible')
        .select('AKTIF');

      // KLIK TOMBOL "SIMPAN" (casing disesuaikan: Simpan)
      cy.contains('Simpan', { timeout: 10000 }).should('be.visible').click(); // <--- UBAH DI SINI
      cy.wait(2000);

      cy.contains(namaRincian, { timeout: 10000 })
        .scrollIntoView() // <--- Tambahin ini: scroll elemennya ke dalam view
        .should('be.visible');
    }
    cy.log('Selesai menambahkan 20 data Rincian Output.');

  // --- TEST FITUR: EDIT DATA (jika tombol save-nya juga 'Simpan') ---
  it('should be able to edit existing unit data', () => {
    cy.log('Memulai test: Edit Existing Data...');
    cy.contains('FARMASI').parent().contains('Edit', { timeout: 10000 }).should('be.visible').click();
    cy.wait(1000);

    cy.contains('Edit Unit', { timeout: 10000 }).should('be.visible');

    const editedUnitName = 'FARMASI_EDITED';
    cy.get('input#UnitNama', { timeout: 10000 })
      .should('be.visible')
      .should('be.enabled')
      .clear()
      .type(editedUnitName);

    // KLIK TOMBOL "SIMPAN" (casing disesuaikan: Simpan)
    cy.contains('Simpan', { timeout: 10000 }).should('be.visible').click(); // <--- UBAH DI SINI JUGA
    cy.wait(2000);

    cy.contains(editedUnitName, { timeout: 10000 }).should('be.visible');
  });
    
  });
});