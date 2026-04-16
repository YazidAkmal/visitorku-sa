import Swal from 'sweetalert2';

export const SwalHelper = {
  // Konfirmasi Hapus Data
  async confirmDelete(itemName = 'Data') {
    return await Swal.fire({
      title: `Hapus ${itemName}?`,
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFCB45', 
      cancelButtonColor: '#9CA3AF', 
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });
  },

  // Alert Loading
  showLoading(title = 'Memproses...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  // Alert Sukses
  success(title = 'Berhasil!', text = '') {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#2BB5F4' 
    });
  },

  // Alert Error
  error(title = 'Gagal!', text = 'Terjadi kesalahan sistem.') {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonColor: '#2BB5F4'
    });
  },
  
  // Tutup Alert
  close() {
    Swal.close();
  }
};