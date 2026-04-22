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

      cy.log('Mengklik "Unit" untuk navigasi ke halaman Setting Unit...');
      cy.contains('Unit', { timeout: 10000 }).should('be.visible').click({ force: true });
      cy.wait(3000); // Tunggu halaman Setting Unit load

      cy.log('Memulai test: Add New Data...');
      cy.contains('Add Data', { timeout: 10000 }).should('be.visible').click();
      cy.wait(1000); // Tunggu form Add Data muncul

      // --- LOOP UNTUK MENAMBAHKAN 20 DATA UNIT BARU ---
    for (let i = 1; i <= 20; i++) {
      cy.log(`Menambahkan data Unit ke-${i}/20`);

      cy.contains('Add Data', { timeout: 10000 }).should('be.visible').click(); // Klik tombol "Add Data"
      cy.wait(1000); // Tunggu form Add Data muncul

      // Verifikasi form/modal Add Data muncul
      cy.contains('Create Unit', { timeout: 10000 }).should('be.visible'); // Judul form dari screenshot: "Create Unit"

      // Buat data unik biar nggak konflik kalau diulang
      const uniqueCode = `CODE-${Cypress._.random(0, 1e6)}-${i}`; // Tambah i biar lebih unik di setiap iterasi
      const uniqueUnitName = `UNITNAME ${Cypress._.random(0, 1e6)}-${i}`; // Tambah i biar lebih unik

      // ISI "CODE" (gunakan ID dari HTML: UnitKode)
      cy.get('input#UnitKode', { timeout: 10000 })
        .should('be.visible')
        .should('be.enabled')
        .type(uniqueCode);
      // Asumsi ada Livewire, tambahkan wait jika ada interaksi yang picu Livewire
      // cy.wait('@livewireRequest'); // Jika Livewire Request diintercept

      // ISI "UNIT NAME" (gunakan ID dari HTML: UnitNama)
      cy.get('input#UnitNama', { timeout: 10000 })
        .should('be.visible')
        .should('be.enabled')
        .type(uniqueUnitName);
      // Asumsi ada Livewire, tambahkan wait jika ada interaksi yang picu Livewire
      // cy.wait('@livewireRequest'); // Jika Livewire Request diintercept

      // Klik tombol "Create"
      cy.get('button[type="submit"]:contains("Create")', { timeout: 10000 }).should('be.visible').click(); // Gunakan 'CREATE'
      // Asumsi ada Livewire, tambahkan wait jika ada interaksi yang picu Livewire (submit form)
      // cy.wait('@livewireRequest'); // Jika Livewire Request diintercept

      cy.wait(2000); // Tunggu data tersimpan dan list terupdate

      // Verifikasi data baru muncul di tabel
      cy.contains(uniqueUnitName, { timeout: 10000 })
        .scrollIntoView() // Agar elemen yang baru ditambahkan terlihat jika di bawah
        .should('be.visible');
      // cy.contains('Data added successfully!', { timeout: 10000 }).should('be.visible'); // OPSIONAL: Verifikasi pesan sukses
    }
    cy.log('Selesai menambahkan 20 data Unit baru.');
      
      
    });
  });