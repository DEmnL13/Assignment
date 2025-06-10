# Assesment-Técnico
Assesment Técnico para Backend y Frontend
Cumple con todos los puntos solicitados a revisar (excepto el extra de front para mostrar la ubicación actual del usuario), en cuanto al Backend, interprete lo mejor que pude las instrucciones y algunos "conflictos" que había en el diseño, algúnos de los requisitos, por ejemplo, no estaban especificádos (como el tipo de usuario Administrador, que no se encuentra en el esquema del documento, por lo que me tome la molestia de implementar una tabla para que sea ESE el usuario que, bueno, administra la información).
En los últimos 2 endpoints que especificaba, debido a la manera en la que manejo la tabla de admin como la que hace el login y no la de usuarios (para darle más coherencia al proyecto) varía un poco de las rutas originales, pero mantienen la misma función.
Me tome la molestia de pedirle a la IA que prganizara y comentara los archivos (especíalmente App.js y Server.js, los más importantes) para facilitar su comprensión.
Mejore ligeramente la presentación pero sin alejarme del "diseño" que está en el documento, utilice componentes predeterminados de Boostrap como los botones y tablas, pero pueden ser personalizados desde App.css.
Recicle un par de elementos de proyectos anteriores, como algunos de los modales y la misma tabla, pero en todas las pruebas que realice no dio ningun error.
Lo hice responsibo para que la interfaz no se rompiera según el tamaño de la ventana, pero no cubri que fuera para dispositivos móviles, dada la naturaleza del trabajo.
Aunque es posible implementar más herramientas y darle una mejor presentación, me decidí por un punto intermédio; no queria arriesgarme demasiado (sobre todo porque son cosas que aún no sé manejar del todo y luego podría equivocarme) pero tampoco queria entregar algo muy sencillo.
Me parece que es todo.
Para correrlo:
Solo es necesario instalar las dependencias, despues desde la consola, puede abrir una para front con npm start y para back con node server.js.
La base de datos esta en pgAdmin4 (la versión de PostgeSQL es la 16).
