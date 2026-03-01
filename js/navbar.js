// Función que decide si el navbar debe estar "activo" (fondo blanco) o no
function updateNavbar() {
  // window.scrollY es la posición vertical de scroll actual
    const scrollY = window.scrollY ?? document.documentElement.scrollTop;


  // Si estamos muy arriba (menos de 40px), consideramos "top"
    const isAtTop = scrollY < 40;

    if (isAtTop) {
    // Estamos arriba del todo:
    // quitamos la clase del body => navbar se verá transparente
    document.body.classList.remove("nav-on");
    } else {
    // Ya hemos bajado:
    // añadimos clase => navbar pasa a blanco (según CSS)
    document.body.classList.add("nav-on");
    }
}

// Scroll manual: cada vez que el usuario hace scroll, recalculamos estado del navbar
// passive:true mejora rendimiento: le decimos al navegador que no vamos a bloquear el scroll
window.addEventListener("scroll", updateNavbar, { passive: true });

// Al cargar: si recargas estando ya a mitad de página, ajusta el navbar correctamente
window.addEventListener("load", updateNavbar);