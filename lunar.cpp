#include <cstdio>
#include <iostream>
#include <cassert>
#include <vector>
#include <GL/freeglut.h>
#include "api.hpp"
extern "C" {
	void lunar_initialize(int, int, const char *);
	void lunar_update();
	void lunar_flush();
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
void lunar_polygon_draw(unsigned id)
{
	assert(id > 0 && id <= v_polygon.size());
	const auto &polygon = v_polygon[id - 1];
	glColor3f(polygon.r, polygon.g, polygon.b);
	glBegin(GL_POLYGON);
		glVertex2f(-0.5f + polygon.x_offset, -0.5f + polygon.y_offset);
		glVertex2f( 0.5f + polygon.x_offset, -0.5f + polygon.y_offset);
		glVertex2f( 0.5f + polygon.x_offset,  0.5f + polygon.y_offset);
		glVertex2f(-0.5f + polygon.x_offset,  0.5f + polygon.y_offset);
	glEnd();
}
