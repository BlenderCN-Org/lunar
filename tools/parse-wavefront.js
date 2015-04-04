#!/usr/bin/env node
var fs = require('fs');
var join_path = require('path').join;
var source_lines = (
	fs.readFileSync('/dev/stdin', { encoding: 'utf8' }).split('\n')
);
var command_handlers = {};
var objects = {};
var current_object;
var current_faceset;
command_handlers.mtllib = function() {
};
command_handlers.o = function(name) {
	current_object = objects[name] = {};
	current_object.name = name;
	current_object.v = [];
	current_object.vt = [];
	current_object.f = {};
};
command_handlers.v = function(xyz) {
	current_object.v.push (
		xyz.split(' ').map (
			function(coordinate) {
				return parseFloat(coordinate);
			}
		)
	);
};
command_handlers.vt = function(uv) {
	current_object.vt.push (
		uv.split(' ').map (
			function(coordinate) {
				return parseFloat(coordinate);
			}
		)
	);
};
command_handlers.usemtl = function(name) {
	current_faceset = current_object.f[name] = {};
	current_faceset.name = name;
	current_faceset.vi = [];
	current_faceset.vti = [];
};
command_handlers.f = function(vi_vti) {
	vi_vti.split(' ').forEach (
		function(vi_vti) {
			vi_vti = vi_vti.split('/').map (
				function(vi_vti) {
					return parseInt(vi_vti);
				}
			);
			current_faceset.vi.push(vi_vti[0]);
			current_faceset.vti.push(vi_vti[1]);
		}
	);
};
command_handlers.s = function() {
};
source_lines.forEach (
	function(line) {
		var command;
		var command_handler;
		var args;
		var regex_result;
		var first_hash_index = line.indexOf('#');
		if(first_hash_index !== -1) {
			line = line.slice(0, first_hash_index);
		}
		line = line.trim();
		if(line === '') {
			return;
		}
		regex_result = /^([^ ]+)( (.*))?$/.exec(line);
		if(!regex_result) {
			throw new Error("Cannot parse '" + line + "'.");
		}
		command = regex_result[1];
		command_handler = command_handlers[command];
		args = regex_result[3];
		if(!command_handler) {
			console.error("Ignoring unknown command line '" + line + "'.");
			return;
		}
		command_handler(args);
	}
);
console.log(JSON.stringify(objects));
