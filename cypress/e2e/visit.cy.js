// cypress/e2e/visit.cy.js (atau nama file test kamu)

describe('Login page', () => {
  // Test terpisah untuk skenario login gagal:
  it('should show error for invalid credentials', () => {
    cy.visit('https://sit.stagingapp.dev/login')

    cy.get('input[name="UserName"]').should('be.visible').type('wrong_user'); // Username salah
    cy.get('input[name="password"]').should('be.visible').type('wrong_pass'); // Password salah
    cy.get('input[type="checkbox"]').check().should('be.checked');

    cy.get('button[type="submit"]:contains("Sign in")').should('be.visible').click();

    cy.contains('These credentials do not match our records.', { timeout: 10000 }).should('exist');
  })


  it('should login successfully with correct credentials', () => {
    cy.visit('https://sit.stagingapp.dev/login')

    cy.get('input[name="UserName"]').should('be.visible').type('testuser');
    cy.get('input[name="password"]').should('be.visible').type('password');
    cy.get('input[type="checkbox"]').check().should('be.checked');
    cy.get('button[type="submit"]:contains("Sign in")').should('be.visible').click();
    cy.url().should('include', '/dashboard');
    // Ganti 'Welcome to Dashboard' dengan teks unik yang ada di halaman dashboard setelah login sukses
    cy.contains("You're logged in!", { timeout: 10000 }).should('be.visible'); // Tambahin timeout juga di sini
  })
})

describe('Dashboard - Setting Menu and Sub-Items', () => {
  beforeEach(() => {

    cy.visit('https://sit.stagingapp.dev/login');
    cy.get('input[name="UserName"]').should('be.visible').type('testuser'); // username (u kecil)
    cy.get('input[name="password"]').should('be.visible').type('password');
    cy.get('button[type="submit"]:contains("Sign in")', { timeout: 10000 }).should('be.visible').click(); // Sign In (I kapital)
    cy.url().should('include', '/dashboard');
    cy.wait(5000); 

    // KLIK TOMBOL UNTUK MUNCULKAN SIDEBAR/NAVBAR
    cy.log('Mencoba klik tombol toggle sidebar...');
    cy.get('button[\\@click\\.stop="sidebarToggle = !sidebarToggle"]', { timeout: 10000 })
      .eq(0)
      .click({ force: true });
    cy.wait(2000); 

  });
});

describe('Setting Unit Page Features', () => {
  // Setiap test di blok ini akan dimulai dengan login dan navigasi ke halaman Setting Unit
  beforeEach(() => {
    // 1. Login
    cy.visit('https://sit.stagingapp.dev/login');
    cy.get('input[name="UserName"]').should('be.visible').type('testuser'); // Ganti dengan username valid
    cy.get('input[name="password"]').should('be.visible').type('password'); // Ganti dengan password valid
    cy.get('button[type="submit"]:contains("Sign in")', { timeout: 10000 }).should('be.visible').click();
    cy.url().should('include', '/dashboard');
    cy.wait(5000);

    // 2. Buka Sidebar Utama
    cy.log('Membuka sidebar utama...');
    cy.get('button[\\@click\\.stop="sidebarToggle = !sidebarToggle"]', { timeout: 10000 })
      .eq(0) // Atau .eq(1) tergantung mana yang benar untuk toggle sidebar
      .click({ force: true });
    cy.wait(4000); // Beri waktu sidebar dan menu Setting untuk otomatis terbuka
 // Verifikasi judul halaman
  });

  // --- TEST FITUR: ADD DATA ---
  it('should be able to add new unit data', () => {
    cy.log('Memulai test: Add New Data...');
    cy.contains('Add Data', { timeout: 10000 }).should('be.visible').click();
    cy.wait(1000); // Tunggu form Add Data muncul

    // Verifikasi form/modal Add Data muncul (contoh, cari judul form/modal)
    cy.contains('Add New Unit Form', { timeout: 10000 }).should('be.visible'); // <--- GANTI TEKS INI DENGAN JUDUL MODAL/FORM ADD

    // Isi "Code Name"
    cy.get('input[name="code_name"]', { timeout: 10000 }).should('be.visible').type('TESTCODE123'); // <--- GANTI 'name="code_name"' SESUAI HTML
    // Isi "Unit Name"
    cy.get('input[name="unit_name"]', { timeout: 10000 }).should('be.visible').type('Test Unit Name 123'); // <--- GANTI 'name="unit_name"' SESUAI HTML

    // Klik tombol "Save" atau "Submit"
    cy.contains('Save', { timeout: 10000 }).should('be.visible').click(); // <--- GANTI 'Save' SESUAI TEKS TOMBOL SUBMIT

    cy.wait(2000); // Tunggu data tersimpan dan list terupdate

    // Verifikasi data baru muncul di tabel (opsional, tergantung notifikasi/data langsung muncul)
    cy.contains('Test Unit Name 123', { timeout: 10000 }).should('be.visible'); // Verifikasi nama unit baru muncul
    cy.contains('Data added successfully!', { timeout: 10000 }).should('be.visible'); // <--- OPSIONAL: Verifikasi pesan sukses jika ada
  });

  // --- TEST FITUR: EDIT DATA ---
  it('should be able to edit existing unit data', () => {
    cy.log('Memulai test: Edit Existing Data...');
    // Asumsi ada data dengan 'FARMASI' di kolom Unit Name (dari screenshot)
    // Cari baris yang mengandung 'FARMASI', lalu klik tombol 'Edit' di baris itu
    cy.contains('FARMASI').parent().contains('Edit', { timeout: 10000 }).should('be.visible').click();
    cy.wait(1000); // Tunggu form Edit Data muncul

    // Verifikasi form/modal Edit Data muncul (contoh, cek judul form/modal)
    cy.contains('Edit Unit Form', { timeout: 10000 }).should('be.visible'); // <--- GANTI TEKS INI DENGAN JUDUL MODAL/FORM EDIT

    // Ubah "Unit Name" (misal tambahin '_EDITED')
    cy.get('input[name="unit_name"]', { timeout: 10000 }).should('be.visible').clear().type('FARMASI_EDITED'); // <--- Pastikan name="unit_name" benar

    // Klik tombol "Save" atau "Update"
    cy.contains('Save', { timeout: 10000 }).should('be.visible').click(); // <--- GANTI 'Save' SESUAI TEKS TOMBOL UPDATE

    cy.wait(2000); // Tunggu data tersimpan dan list terupdate

    // Verifikasi data yang di-edit muncul di tabel
    cy.contains('FARMASI_EDITED', { timeout: 10000 }).should('be.visible');
    cy.contains('Data updated successfully!', { timeout: 10000 }).should('be.visible'); // <--- OPSIONAL: Verifikasi pesan sukses jika ada
  });

  // --- TEST FITUR: SHOW ENTRIES ---
  it('should be able to change "Show entries" dropdown', () => {
    cy.log('Memulai test: Change Show Entries...');
    const entriesOptions = ['10', '25', '50', '100']; // Opsi yang tersedia

    entriesOptions.forEach(option => {
      cy.log(`Memilih ${option} Entries...`);
      // Pilih opsi dari dropdown 'Show entries'
      cy.get('select', { timeout: 10000 }).first().should('be.visible').select(option); // <--- Kalo ada banyak select, pake .first()
      cy.wait(1500); // Tunggu tabel update

      // Verifikasi jumlah baris di tabel (ini agak tricky, tergantung implementasi tabel)
      // Contoh: cy.get('table tbody tr').should('have.length', parseInt(option));
    });
  });

  // --- TEST FITUR: PAGINATION (PREVIOUS/NEXT) ---
  it('should be able to navigate using Previous/Next pagination', () => {
    cy.log('Memulai test: Pagination Previous/Next...');
    // Pastikan ada cukup data untuk memicu pagination
    // Jika tidak, mungkin perlu tambahkan data dummy lebih dulu atau atur "Show 10 Entries"
    cy.get('select', { timeout: 10000 }).first().should('be.visible').select('10'); // Pastikan 10 entries dulu
    cy.wait(1500);

    // Klik "Next" (pastikan tombolnya ada dan aktif)
    cy.contains('Next', { timeout: 10000 }).should('be.visible').click(); // <--- GANTI TEKS 'Next' JIKA BEDA
    cy.wait(2000); // Tunggu halaman ganti

    // Verifikasi halaman berubah (misal, cek data di halaman kedua atau indikator halaman)
    // cy.contains('Teks unik di halaman kedua').should('be.visible'); // <--- OPSIONAL: Cek konten unik di halaman kedua
    // cy.get('.pagination-info').should('contain', 'Page 2'); // <--- OPSIONAL: Cek indikator halaman

    // Klik "Previous"
    cy.contains('Previous', { timeout: 10000 }).should('be.visible').click(); // <--- GANTI TEKS 'Previous' JIKA BEDA
    cy.wait(2000); // Tunggu halaman ganti

    // Verifikasi halaman kembali (misal, cek data di halaman pertama)
    // cy.contains('Teks unik di halaman pertama').should('be.visible'); // <--- OPSIONAL: Cek konten unik di halaman pertama
    // cy.get('.pagination-info').should('contain', 'Page 1'); // <--- OPSIONAL: Cek indikator halaman
  });

});