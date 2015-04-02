#!/usr/bin/env node
var fs = require('fs');
var join_path = require('path').join;
var _ = require('lodash');
var source_file_path = process.argv[2];
var target_directory_path = process.argv[3];
var mode = process.argv[4] || '';
var source_lines = (
	fs.readFileSync(source_file_path, { encoding: 'utf8' }).split('\n')
);
var command_handlers = {};
var objects = {};
var current;
command_handlers.o = function(name) {
	current = objects[name] = {};
	current.vbo = _.times (
		2, function(i) {
			return fs.openSync (
				join_path(target_directory_path, name + '.vbo' + i), 'w'
			);
		}
	);
	current.ibo = [];
	current.vt = [];
};
command_handlers.v = function(xyz) {
	var buffer;
	xyz = xyz.split(' ').map (
		function(coordinate) {
			return parseFloat(coordinate);
		}
	);
	buffer = new Buffer(4 * xyz.length);
	xyz.forEach (
		function(coordinate) {
			buffer.writeFloatLE(coordinate);
		}
	);
	fs.writeSync(current.vbo[0], buffer, 0, buffer.length);
};
command_handlers.vt = function(uv) {
	current.vt.push (
		uv.split(' ').map (
			function(coordinate) {
				return parseFloat(coordinate);
			}
		)
	);
};
command_handlers.usemtl = function(name) {
	var next_ibo_index = current.ibo.length;
	current.ibo.push (
		fs.openSync (
			join_path(target_directory_path, name + '.ibo' + next_ibo_index), 'w'
		)
	);
};
source_lines.forEach (
	function(line) {
		var command;
		var command_handler;
		var args;
		var regex_result;
		var first_hash_index = line.indexOf('#');
		if(first_hash_index !== -1) {
			line = line.slice(0, first_hash_index + 1);
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
			console.log("Ignoring unknown command line '" + line + "'.");
			return;
		}
		command_handler(args);
	}
);
