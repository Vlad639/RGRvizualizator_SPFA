package ru.vogu.rgrvizualuzator;

public class Vertex {
    private int x;
    private int y;
    private int radius;
    private int number;
    private boolean selected;
    static int maxId = 0;
    private int id = 0;


    public Vertex(int x, int y, int radius, int number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.number = number;
        this.id = maxId + 1;
        maxId = this.id;

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

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
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
