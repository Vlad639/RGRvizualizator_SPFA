package ru.vogu.rgrvizualuzator;

public class LineArcOrEdge {
    private Vertex vertex1;
    private Vertex vertex2;
    private int directionTo = -1;

    public LineArcOrEdge(Vertex vertex1, Vertex vertex2) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    public LineArcOrEdge(Vertex vertex1, Vertex vertex2, int directionTo) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.directionTo = directionTo;
    }

    public Vertex getVertex1() {
        return vertex1;
    }

    public void setVertex1(Vertex vertex1) {
        this.vertex1 = vertex1;
    }

    public Vertex getVertex2() {
        return vertex2;
    }

    public void setVertex2(Vertex vertex2) {
        this.vertex2 = vertex2;
    }

    public int getDirectionTo() {
        return directionTo;
    }

    public void setDirectionTo(int directionTo) {
        this.directionTo = directionTo;
    }
}
