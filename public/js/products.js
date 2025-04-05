document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector(".add-to-cart-btn")) return;
    const buttons = document.querySelectorAll(".add-to-cart-btn");
  
    buttons.forEach(button => {
      button.addEventListener("click", async () => {
        const productId = button.dataset.productId;
        const cartId = button.dataset.cartId;
  
        try {
          const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity: 1 })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            Swal.fire({
              toast: true,
              icon: 'success',
              title: 'Producto agregado al carrito',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              background: '#333',
              color: '#fff'
            });
          } else {
            Swal.fire("Error", data.error, "error");
          }
        } catch (error) {
          Swal.fire("Error de red", error.message, "error");
        }
      });
    });
  });