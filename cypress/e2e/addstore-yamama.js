describe('Delete "Toko Baru" Stores Flow', () => {
  it('should successfully delete all stores starting with "Toko Baru"', () => {
    // --- Langkah-langkah Login ---
    cy.visit('https://yb-admin.stagingapp.dev/stores');

    // Masukkan email dan password menggunakan selector type
    cy.get('input[type="email"]').should('be.visible').type('superadmin@ym.com');
    cy.get('input[type="password"]').should('be.visible').type('@password123');
    
    // Klik tombol "Sign In"
    cy.get('button[type="button"]:contains("Sign In")').should('be.visible').click();
    
    // Verifikasi setelah login berhasil
    cy.url().should('include', '/dashboard'); // Memastikan berada di halaman stores setelah login
    cy.get('a[href="/stores"]').contains('Store Management').click();

    // --- Langkah-langkah Menghapus Toko Baru ---

    // Fungsi rekursif untuk mencari dan menghapus toko
    const deleteStoreRecursively = () => {
      cy.log('Searching for "Toko Baru" stores to delete...');
      
      // Ketikkan teks pencarian
      cy.get('input[placeholder="Search"]').should('be.visible').clear().type('Toko Baru');
      cy.wait(1500); // Tunggu sebentar agar hasil pencarian terload

      // Periksa apakah ada baris toko yang mengandung "Toko Baru"
      cy.get('body').then(($body) => {
        // Selector untuk baris toko pertama yang mengandung teks "Toko Baru"
        // Anda MUNGKIN perlu menyesuaikan selector 'tbody tr:contains("Toko Baru"):first'
        // Tergantung struktur tabel Anda, mungkin 'div.store-list-item:contains("Toko Baru"):first'
        const firstStoreRow = 'tbody tr:contains("Toko Baru"):first'; 

        if ($body.find(firstStoreRow).length > 0) {
          cy.log('Store found, proceeding to delete...');
          
          cy.get(firstStoreRow).within(() => {
            // Klik tombol aksi untuk baris toko ini
            cy.get('button[aria-label="Action Menu"]').should('be.visible').click();
          });
          
          // Klik tombol "Hapus" dari dropdown yang muncul
          // Asumsi dropdown muncul di DOM dan bisa diakses secara global
          cy.contains('button', 'Hapus').should('be.visible').click();

          // --- PENTING: Jika ada modal konfirmasi hapus, tambahkan langkah-langkah di sini ---
          // Contoh:
          // cy.get('div.modal-confirm-delete').contains('button', 'Confirm').click(); 
          // cy.wait(500); // Tunggu modal tertutup

          // Verifikasi pesan sukses (opsional)
          cy.contains('Store deleted successfully', { timeout: 10000 }).should('be.visible');
          cy.wait(2000); // Tunggu agar notifikasi hilang dan daftar toko diperbarui

          // Panggil kembali fungsi untuk mencari dan menghapus toko berikutnya
          deleteStoreRecursively(); 
        } else {
          cy.log('No more "Toko Baru" stores found. Deletion complete.');
        }
      });
    };

    // Mulai proses penghapusan
    deleteStoreRecursively(); 
  });
});
