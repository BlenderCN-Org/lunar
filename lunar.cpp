#include <cstdio>
#include <iostream>
#include <cassert>
#include <vector>
#include <GL/freeglut.h>
extern "C" {
	void lunar_initialize(int, int, const char *);
	void lunar_update();
	void lunar_flush();
	void lunar_polygon_allocate(unsigned);
	void lunar_polygon_set_color(unsigned, float, float, float);
	void lunar_polygon_set_offset(unsigned, float, float);
	void lunar_polygon_draw(unsigned);
}
void lunar_initialize(int width, int height, const char *window_title)
{
	int no_argc = 0;
	glutInit(&no_argc, NULL);
	glutInitWindowSize(width, height);
	glutCreateWindow(window_title);
}
void lunar_update()
{
	glutMainLoopEvent();
}
void lunar_flush()
{
	glFlush();
}
// ---
struct Polygon
{
	float r, g, b;
	float x_offset, y_offset;
};
auto gPolygons = std::vector<Polygon>();
void lunar_polygon_allocate(unsigned count)
{
	gPolygons.resize(count, Polygon{});
}
void lunar_polygon_set_color(unsigned id, float r, float g, float b)
{
	assert(id > 0 && id <= gPolygons.size());
	Polygon &polygon = gPolygons[id - 1];
	polygon.r = r;
	polygon.g = g;
	polygon.b = b;
}
void lunar_polygon_set_offset(unsigned id, float x, float y)
{
	assert(id > 0 && id <= gPolygons.size());
	Polygon &polygon = gPolygons[id - 1];
	polygon.x_offset = x;
	polygon.y_offset = y;
}
void lunar_polygon_draw(unsigned id)
{
	assert(id > 0 && id <= gPolygons.size());
	const Polygon &polygon = gPolygons[id - 1];
	glColor3f(polygon.r, polygon.g, polygon.b);
	glBegin(GL_POLYGON);
		glVertex2f(-0.5f + polygon.x_offset, -0.5f + polygon.y_offset);
		glVertex2f( 0.5f + polygon.x_offset, -0.5f + polygon.y_offset);
		glVertex2f( 0.5f + polygon.x_offset,  0.5f + polygon.y_offset);
		glVertex2f(-0.5f + polygon.x_offset,  0.5f + polygon.y_offset);
	glEnd();
}
