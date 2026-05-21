import Swal from 'sweetalert2'

export const SwalHelper = {
  async confirmDelete(itemName = 'Data') {
    return await Swal.fire({
      title: `Hapus ${itemName}?`,
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFCB45',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })
  },

  showLoading(title = 'Memproses...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  },

  close() {
    Swal.close()
  },
}
