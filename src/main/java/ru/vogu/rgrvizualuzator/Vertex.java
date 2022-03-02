package ru.vogu.rgrvizualuzator;


public class Vertex {
    private int x;
    private int y;
    private int radius;
    private boolean selected;
    private static int maxId = 0;
    private int id = 0;

    public Vertex(int x, int y, int radius, boolean selected, int id) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.selected = selected;
        this.id = id;
    }

    public Vertex(int x, int y, int radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.id = maxId + 1;
        maxId = this.id;
    }

    public Vertex(int x, int y, int radius, boolean selected) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.selected = selected;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public static int getMaxId() {
        return maxId;
    }

    public static void setMaxId(int maxId) {
        Vertex.maxId = maxId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}
