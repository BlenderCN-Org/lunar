all: lunar
lunar:
	./codegen api.hpp.hbs >api.hpp
	./codegen api.cpp.hbs >api.cpp
	gcc -shared -fPIC -Wall -Wl,--no-as-needed -lglut -lstdc++ -Wl,--as-needed -std=c++0x -o lunar.so \
		api.cpp \
		lunar.cpp 
run: lunar
	luajit main.lua
