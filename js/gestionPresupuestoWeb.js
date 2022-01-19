import * as genDatEst from "./gestionPresupuesto.js";

function mostrarDatoEnId(idElemento, valor) {
    let Elemen = document.getElementById(idElemento);
    Elemen.innerHTML = valor;
}
function mostrarGastoWeb(idElemento, gasto){
    let elemento = document.getElementById(idElemento);

    let divGasto = document.createElement("div");
    divGasto.className += "gasto";

    let divGastoDesc = document.createElement("div");
    divGastoDesc.className += "gasto-descripcion";
    divGastoDesc.textContent = gasto.descripcion;

    let divGastoFecha = document.createElement("div");
    divGastoFecha.className += "gasto-fecha";
    divGastoFecha.textContent = new Date(gasto.fecha).toLocaleDateString();

    let divGastoValor = document.createElement("div");
    divGastoValor.className += "gasto-valor";
    divGastoValor.textContent = gasto.valor;

    let divGastoEtiquetas = document.createElement("div");
    divGastoEtiquetas.className += "gasto-etiquetas";

    elemento.append(divGasto);
    divGasto.append(divGastoDesc);
    divGasto.append(divGastoFecha);
    divGasto.append(divGastoValor);

    gasto.etiquetas.forEach(e => {
        let borrarEtiquetas = new BorrarEtiquetasHandle();
        borrarEtiquetas.gasto = gasto;
        borrarEtiquetas.etiqueta = e;

        let divEtiqueta = document.createElement("span");
        divEtiqueta.className += "gasto-etiquetas-etiqueta";
        divEtiqueta.textContent = e + " ";
        if(idElemento == "listado-gastos-completo"){
            divEtiqueta.addEventListener("click", borrarEtiquetas);
        }
        divGastoEtiquetas.append(divEtiqueta);
    });  

    divGasto.append(divGastoEtiquetas);
    let editarHandler = new EditarHandle();
    editarHandler.gasto = gasto;

    let btnEditar = document.createElement("button");
    btnEditar.className = "gasto-editar";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", editarHandler);
    
    let borrarHandler = new BorrarHandle();
    borrarHandler.gasto = gasto;

    let btnBorrar = document.createElement("button");
    btnBorrar.className = "gasto-borrar";
    btnBorrar.textContent = "Borrar";
    btnBorrar.addEventListener("click", borrarHandler);

    let botonGuardarGastos = document.getElementById("guardar-gastos");
    botonGuardarGastos.addEventListener('click',new guardarGastosWeb);
    
    let botonCargarGastos = document.getElementById("cargar-gastos");
    botonCargarGastos.addEventListener('click',new cargarGastosWeb);
    if(idElemento == "listado-gastos-completo"){
        divGasto.append(btnEditar);
        divGasto.append(btnBorrar);
    }
    let cargarApi = document.getElementById("cargar-gastos-api");
    //cargarApi.addEventListener('click',new cargarGastosApi);
    //if(idElemento == "listado-gastos-completo"){
    //    divGasto.append(btnEditar);
    //    divGasto.append(btnBorrar);
    //}
    cargarApi.onclick = cargarGastosApi;

    let buttonEditForm = document.createElement("button");
        buttonEditForm.className = 'gasto-editar-formulario';
        buttonEditForm.setAttribute('id', `gasto-editar-formulario-${gasto.id}`);
        buttonEditForm.textContent = 'Edit(Form)';

        let editFormHandler = new EditarHandleFormulario();
        editFormHandler.padre = divGasto;
        editFormHandler.gasto = gasto;
        buttonEditForm.addEventListener('click', editFormHandler);

        divGasto.append(buttonEditForm);

        
        let buttonBorrarApi = document.createElement("button");
        buttonBorrarApi.className = 'gasto-borrar-api';
        buttonBorrarApi.textContent = 'Borrar (API)';

        let borrarGastApi = new borrarGastosApi();
        borrarGastApi.gasto = gasto;
        buttonBorrarApi.addEventListener('click', borrarGastApi);
    
        divGasto.append(buttonBorrarApi);
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
    const Elemen = document.getElementById(idElemento);
    let datos = ""
    for (let [llave, val] of Object.entries(agrup)) {
        datos +=
            `<div class="agrupacion-dato">
          <span class="agrupacion-dato-clave">${llave}</span>
          <span class="agrupacion-dato-valor">${val}</span>
      </div>`
    };
    Elemen.innerHTML +=
        `<div class="agrupacion">
      <h1>Gastos agrupados por ${periodo}</h1>
      ${datos}
  `

}
function repintar() {
    document.getElementById("presupuesto").innerHTML="";
    document.getElementById("gastos-totales").innerHTML="";
    document.getElementById("balance-total").innerHTML="";
    mostrarDatoEnId("presupuesto", genDatEst.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", genDatEst.calcularTotalGastos());
    mostrarDatoEnId("balance-total", genDatEst.calcularBalance());
    document.getElementById("listado-gastos-completo").innerHTML = "";
    genDatEst.listarGastos().forEach(g => {
        mostrarGastoWeb("listado-gastos-completo", g);
    });
    document.getElementById("listado-gastos-filtrado-1").innerHTML="";
    genDatEst.filtrarGastos({fechaDesde: "2021-09-01", fechaHasta: "2021-09-30"}).forEach(gf => {
        mostrarGastoWeb("listado-gastos-filtrado-1",gf);
    });

    document.getElementById("listado-gastos-filtrado-2").innerHTML = "";
    genDatEst.filtrarGastos({valorMinimo: 50}).forEach(gf => {
        mostrarGastoWeb("listado-gastos-filtrado-2", gf);
    });

    document.getElementById("listado-gastos-filtrado-3").innerHTML = "";
    genDatEst.filtrarGastos({valorMinimo: 200, etiquetasTiene: ["seguros"]}).forEach(gf => {
        mostrarGastoWeb("listado-gastos-filtrado-3", gf);
    });

    document.getElementById("listado-gastos-filtrado-4").innerHTML = "";
    genDatEst.filtrarGastos({valorMaximo: 50, etiquetasTiene: ["comida" , "transporte"]}).forEach(gf => {
        mostrarGastoWeb("listado-gastos-filtrado-4", gf);
    });

    document.getElementById("agrupacion-dia").innerHTML="";
    mostrarGastosAgrupadosWeb("agrupacion-dia", genDatEst.agruparGastos("dia"), "día");

    document.getElementById("agrupacion-mes").innerHTML = "";
    mostrarGastosAgrupadosWeb("agrupacion-mes", genDatEst.agruparGastos("mes"), "mes");

    document.getElementById("agrupacion-anyo").innerHTML = "";
    mostrarGastosAgrupadosWeb("agrupacion-anyo", genDatEst.agruparGastos("anyo"), "año");

}
function actualizarPresupuestoWeb() {
    let conV = prompt("introduzca un presupuesto");
    genDatEst.actualizarPresupuesto(parseFloat(conV));
    repintar();
}
function nuevoGastoWeb() {
    let desc = prompt("introduce una descripción");
    let val = prompt("introduce un nuebo valor");
    let fech = prompt("introduce una nueva fecha");
    let eti = prompt("introduce nuevas etiquetas");
    let valu = parseFloat(val);
    let ArrEti = new Array();
        ArrEti = eti.split(",");
    let gast = new genDatEst.CrearGasto(desc, valu, fech, ...ArrEti);
    genDatEst.anyadirGasto(gast);
    repintar();
}
function nuevoGastoWebFormulario(){
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");
    let butto = document.getElementById("anyadirgasto-formulario");
    butto.disabled = true;
    document.getElementById("controlesprincipales").append(formulario);
    let event = new creargastformhand();
    event.formulario = formulario;
    event.butto = butto;
    formulario.addEventListener("submit",event);
    let cancelarEvent = new cancelarHandle();
    cancelarEvent.formulario = formulario;
    formulario.querySelector("button[class='cancelar']").addEventListener('click', cancelarEvent);
    
    //let button = document.getElementById("gasto-enviar-api");
    let evento = new Gastoenviarapi();
    evento.formulario = formulario;
    evento.butto = butto;
    formulario.querySelector("button[class='gasto-enviar-api']").addEventListener("click",evento);
}
function creargastformhand(){
    this.handleEvent = function(event){
        event.preventDefault();

            let descripForm = this.formulario.elements.descripcion.value;
            let valorForm = this.formulario.elements.valor.value;
            let dateForm = this.formulario.elements.fecha.value;
            let eticForm = this.formulario.elements.etiquetas.value;
            let eticqForm = new Array();
            eticqForm = eticForm.split(",");

            let gastoForm = new genDatEst.CrearGasto(descripForm,parseFloat(valorForm), dateForm, ...eticqForm);
            genDatEst.anyadirGasto(gastoForm);
            this.butto.disabled = false;
            repintar();
       
}
}
function cancelarHandle() {
    this.handleEvent = function() {
        this.formulario.remove();
        document.getElementById("anyadirgasto-formulario").disabled = false;
    }
}
function EditarHandleFormulario() {
    this.handleEvent = function(event) {
        let formulario = document.getElementById("formulario-template").content.cloneNode(true).querySelector("form");
       this.padre.append(formulario);
        document.getElementById(`gasto-editar-formulario-${this.gasto.id}`).disabled = true;

        formulario.descripcion.value = this.gasto.descripcion;
        formulario.valor.value = this.gasto.valor;

        let fecha = new Date(this.gasto.fecha);
        let fechaFormateda = fecha.toISOString().substring(0,10);
        formulario.fecha.value = fechaFormateda;

        let etiquetaString = "";
        this.gasto.etiquetas.forEach((etiqueta, index) => {
            if (this.gasto.etiquetas.length - 1 === index) {
                etiquetaString += etiqueta;
            }
            else {
                etiquetaString += etiqueta + ", ";
            }
        });
        formulario.etiquetas.value = etiquetaString;

        let cancelarEvent = new cancelarEditHandle();
        cancelarEvent.formulario = formulario;
        cancelarEvent.gasto = this.gasto;
        formulario.querySelector("button[class='cancelar']").addEventListener('click', cancelarEvent);

        let submitEvent = new submitEditHandle();
        submitEvent.gasto = this.gasto;
        formulario.addEventListener('submit', submitEvent);

        let Putevento = new GastoPut();
        Putevento.formulario = formulario;
        Putevento.gasto = this.gasto;
        Putevento.elemento = this.elemento;
        Putevento.butto = this.butto;
        formulario.querySelector("button[class='gasto-enviar-api']").addEventListener("click",Putevento);

    }
    function submitEditHandle () {
        this.handleEvent = function(event) {
            this.gasto.actualizarDescripcion(event.currentTarget.descripcion.value);
            this.gasto.actualizarValor(parseFloat(event.currentTarget.valor.value));
            this.gasto.actualizarFecha(event.currentTarget.fecha.value);
            let etiquetas = event.currentTarget.etiquetas.value;
            if (typeof etiquetas !== "undefined") {
                etiquetas = etiquetas.split(",");
            }
            this.gasto.etiquetas = etiquetas;

            repintar();
        }
    }
    function cancelarEditHandle () {
        this.handleEvent = function() {
            this.formulario.remove();
            document.getElementById(`gasto-editar-formulario-${this.gasto.id}`).disabled = false;
        }
    }
}
function EditarHandle() {
    this.handleEvent = function () {
        let desc = prompt("introduce una descripción");
        let val = prompt("introduce un nuebo valor");
        let fech = prompt("introduce una nueva fecha");
        let eti = prompt("introduce nuevas etiquetas");
        let valu = parseFloat(val);
        let ArrEti = eti.split(", ");
        this.gasto.descripcion = desc;
        this.gasto.valor = valu;
        this.gasto.fecha = fech;
        this.gasto.etiquetas = ArrEti;
        repintar();
    }
}
function BorrarHandle(Gasto) {

       this.gasto = Gasto 

    this.handleEvent = function() {
        genDatEst.borrarGasto(this.gasto.id);
        repintar();
    }
}
function BorrarEtiquetasHandle(){

    this.handleEvent = function(){
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    };

}
function filtrarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        let desc = document.getElementById("formulario-filtrado-descripcion").value;
        let vm = parseFloat(document.getElementById("formulario-filtrado-valor-minimo").value);
        let vmax =  parseFloat(document.getElementById("formulario-filtrado-valor-maximo").value);
        let fechD = document.getElementById("formulario-filtrado-fecha-desde").value;
        let fechH = document.getElementById("formulario-filtrado-fecha-hasta").value;
        let etF = document.getElementById("formulario-filtrado-etiquetas-tiene").value; 
        let filtro = {};

        if(etF.length > 0){
            filtro.etiquetasTiene = genDatEst.transformarListadoEtiquetas(etF);
        }
        if(desc != ""){
            filtro.descripcionContiene = desc;
        }
        if(vm != "" && typeof vm !== "undefined" && !isNaN(vm)){
            filtro.valorMinimo = vm;
        }
        if(vmax != "" && typeof vmax !== "undefined" && !isNaN(vmax)){
            filtro.valorMaximo = vmax;
        }
        if(Date.parse(fechD)){
            filtro.fechaDesde = fechD;
        }
        if(Date.parse(fechH)){
            filtro.fechaHasta = fechH;
        }
        console.log(filtro);

        document.getElementById("listado-gastos-completo").innerHTML="";
        let gastosFiltrados = genDatEst.filtrarGastos(filtro);
        gastosFiltrados.forEach(g => {
            mostrarGastoWeb("listado-gastos-completo" , g);
        });
    }
}
const formularioFiltrador = document.getElementById("formulario-filtrado");

let filtGastForm = new filtrarGastosWeb();
formularioFiltrador.addEventListener('submit', filtGastForm);

function guardarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        localStorage.GestorGastosDWEC = JSON.stringify(genDatEst.listarGastos());
    }
}

function cargarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        let gastosCargados = JSON.parse(localStorage.getItem("GestorGastosDWEC"));
        if(gastosCargados !== null){
            genDatEst.cargarGastos(gastosCargados);
        }else{
            genDatEst.cargarGastos([]);
        }
        repintar();
    }
}
async function cargarGastosApi(){
        let Link = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
        let User = document.getElementById("nombre_usuario");
        let resp = await fetch(Link + User.value);
        if(resp.ok){
             let json = await resp.json();
             genDatEst.cargarGastos(json);  
             repintar();                 
    }
}
function borrarGastosApi(){
    this.handleEvent =async function(event){
        event.preventDefault();
        let Link = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
        let User = document.getElementById("nombre_usuario");
        let resp = await fetch(Link + User.value + "/" + this.gasto.gastoId, {method: 'DELETE',});
        if(resp.ok){
             await resp.json(); 
             cargarGastosApi();
        } 
    }
}
function Gastoenviarapi(){
    this.handleEvent =async function(event){
        event.preventDefault();
        let descripForm = this.formulario.elements.descripcion.value;
            let valorForm = this.formulario.elements.valor.value;
            let dateForm = this.formulario.elements.fecha.value;
            let eticForm = this.formulario.elements.etiquetas.value;
            let eticqForm = new Array();
            eticqForm = eticForm.split(",");
            let gastoForm = new genDatEst.CrearGasto(descripForm,parseFloat(valorForm), dateForm, ...eticqForm);
        let Link = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
        let User = document.getElementById("nombre_usuario");
        let resp = await fetch(Link + User.value , {method: 'POST', headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(gastoForm)
        });

        if(resp.ok){
            this.butto.disabled = false;
            cargarGastosApi();
       } 
       document.getElementById("controlesprincipales").removeChild(this.formulario);
    }
}
function GastoPut(){
    this.handleEvent =async function(event){
        event.preventDefault();
        this.gasto.actualizarDescripcion(this.formulario.elements.descripcion.value);
            this.gasto.actualizarValor(this.formulario.elements.valor.value);
            this.gasto.actualizarFecha(this.formulario.elements.fecha.value);
            //this.gasto.borrarEtiquetas(this.formulario.elements.etiquetas.value);
            let eticqForm = new Array();
            eticqForm = this.formulario.elements.etiquetas.value.split(",");
            this.gasto.anyadirEtiquetas(...eticqForm);
            
        let Link = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
        let User = document.getElementById("nombre_usuario");
        let resp = await fetch(Link + User.value+"/"+this.gasto.gastoId, {method: 'PUT', headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(this.gasto)
        });

        if(resp.ok){
            
            cargarGastosApi();
       } 
    }
}
export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    EditarHandle,
    BorrarHandle,
    BorrarEtiquetasHandle,
    nuevoGastoWebFormulario
}