all: lunar
lunar:
	gcc -shared -fPIC -Wall -Wl,--no-as-needed -lglut -lstdc++ -Wl,--as-needed -std=c++0x lunar.cpp -o lunar.so
run: lunar
	luajit main.lua
