document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".carrito-contenedor")) return;

  const deleteButtons = document.querySelectorAll(".btn-delete-item");
  const clearCartBtn = document.getElementById("btn-clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // 🗑️ Eliminar producto individual
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.productId;
      const cartId = btn.dataset.cartId;

      const confirm = await Swal.fire({
        title: 'Eliminar producto',
        text: 'Deseas eliminar este producto del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'DELETE'
        });

        if (res.ok) location.reload();
      }
    });
  });

  // 🧹 Vaciar carrito completo
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", async () => {
      const cartId = clearCartBtn.dataset.cartId;

      const confirm = await Swal.fire({
        title: 'Vaciar carrito',
        text: 'Deseas eliminar todos los productos del carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        const res = await fetch(`/api/carts/${cartId}`, {
          method: 'DELETE'
        });

        if (res.ok) location.reload();
      }
    });
  }

  // ✅ Finalizar compra y vaciar carrito
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cartId = checkoutBtn.dataset.cartId;

      try {
        const res = await fetch(`/api/carts/${cartId}/purchase`, {
          method: 'POST'
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: '✅ Compra realizada',
            html: `
              <p><strong>Ticket:</strong> ${data.ticket.code}</p>
              <p><strong>Total:</strong> $${data.ticket.amount}</p>
              <p><strong>Fecha:</strong> ${new Date(data.ticket.purchase_datetime).toLocaleString()}</p>
              <p>📧 Revisa tu email para ver el desglose completo</p>
              <button id="copy-ticket-btn" class="swal2-confirm swal2-styled" style="margin-top:10px;">Copiar código de ticket</button>
            `,
            background: '#333',
            color: '#fff',
            showConfirmButton: false,
            didOpen: () => {
              const copyBtn = document.getElementById("copy-ticket-btn");
              copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(data.ticket.code);
                Swal.fire({
                  toast: true,
                  icon: 'success',
                  title: 'Código copiado al portapapeles',
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 1500,
                  background: '#333',
                  color: '#fff'
                });
              });
            }
          }).then(async () => {
            // Limpiar el carrito después de finalizar la compra
            const clearCartRes = await fetch(`/api/carts/${cartId}`, {
              method: 'DELETE'
            });

            if (clearCartRes.ok) {
              location.reload();  // Recargar la página para reflejar el carrito vacío
            }
          });
        } else {
          Swal.fire("Error", data.error || "No se pudo completar la compra", "error");
        }
      } catch (error) {
        Swal.fire("Error de red", error.message, "error");
      }
    });
  }
});
