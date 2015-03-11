local ffi = require('ffi')
ffi.cdef [[

	void lunar_initialize(int, int, const char *);
	void lunar_update();
	void lunar_flush();

		void lunar_polygon_allocate(unsigned);
			void lunar_polygon_set_color (
				unsigned
					, float
					, float
					, float
			);
			void lunar_polygon_set_offset (
				unsigned
					, float
					, float
			);
			void lunar_polygon_draw(unsigned);
		void lunar_magic_allocate(unsigned);
			void lunar_magic_set_mahou_shoujo (
				unsigned
					, const char *
					, const char *
			);
]]
local lib = ffi.load('./lunar.so')
local c = 100
return {
	initialize = function(self, width, height, window_title)
		lib.lunar_initialize(width, height, window_title or '')
		lib.lunar_polygon_allocate(3)
		lib.lunar_polygon_set_color(1, 1, 0, 1)
		lib.lunar_polygon_set_color(2, 0, 1, 1)
		lib.lunar_polygon_set_color(3, 1, 1, 0)
	end
	, draw = function(self)
		lib.lunar_update();
		local id = math.floor(c / 100)
		lib.lunar_polygon_draw(id)
		c = c + 1
		if c >= 400 then
			c = 100
		end
		lib.lunar_flush();
	end
}
