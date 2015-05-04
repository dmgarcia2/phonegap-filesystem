"use strict";

var dirEntry;
var entries;

var phonegap = {};

phonegap.app = {
	
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        StatusBar.hide();
		FastClick.attach(document.body);
        phonegap.app.cargar();
    },

    cargar: function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, phonegap.app.onFileSystemSuccess, phonegap.app.fail);
    },

    onFileSystemSuccess: function(fileSystem) {
        dirEntry = fileSystem.root;
        var dirReader = dirEntry.createReader();

        entries = [];
        phonegap.app.readEntries(dirReader);
    },

    readEntries: function(dirReader) {
        dirReader.readEntries(function(results) {
            if (!results.length) {
                phonegap.app.listResults(entries.sort());
            } else {
                entries = entries.concat(phonegap.app.toArray(results));
                phonegap.app.readEntries(dirReader);
            }
        }, phonegap.app.fail);
    },

    toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
    },

    getDirSuccess: function(dir) {
        alert(dir.name);
    },

    listResults: function(entries) {
        var $tabla = $('#tabla');
        $tabla.empty();

        entries.forEach(function(entry, i) {
            $tabla.append('<li>' + entry.name + '</li>');
        });

        $tabla.listview('refresh');
    },

    fail: function(error) {
        var msg = '';

        switch (error.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };

        alert('Error: ' + msg + ' (' + error.name + ')');
    },

    // < -------- JERARQUIA DE CLASES -------- >
    // FUNCIONES ESCRITURA
    createTextFile: function(filename) {
        alert('Creando fichero: ' + filename);
        dirEntry.getFile(filename, {create: true}, phonegap.app.writeGotFileEntry, phonegap.app.fail);
    },

    writeGotFileEntry: function(fileEntry) {
        alert('Obteniendo el file entry');
        fileEntry.createWriter(phonegap.app.gotFileWriter);
    },

    gotFileWriter: function(writer) {
        alert('Escribiendo...');
        writer.seek(writer.length);
        writer.write("Probando... " + new Date().toString() + "\n");

        var dirReader = dirEntry.createReader();
        entries = [];
        phonegap.app.readEntries(dirReader);
    },

    // < -------- FUNCIONES ESCRITURA -------- >
    // FUNCIONES LECTURA
    loadTextFile: function(filename) {
        alert('Leyendo fichero: ' + filename);
        dirEntry.getFile(filename, {}, phonegap.app.readGotFileEntry, phonegap.app.fail);
    },

    readGotFileEntry: function(fileEntry) {
        alert('Obteniendo el file entry');
        fileEntry.file(phonegap.app.gotFileLoad, phonegap.app.fail);
    },

    gotFileLoad: function(file) {
        alert('Empezando a leer...');
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            alert(evt.target.result);
        };

        alert('Leyendo...');
        reader.readAsText(file);
    }
    // < -------- FUNCIONES LECTURA -------- >

};
