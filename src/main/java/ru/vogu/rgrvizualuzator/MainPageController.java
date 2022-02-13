package ru.vogu.rgrvizualuzator;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MainPageController {

    List<Vertex> vertexArrayList = new ArrayList<>();
    List<LineArcOrEdge> lineArcOrEdges = new ArrayList<>();

    @RequestMapping("/")
    String index(){

        lineArcOrEdges = new ArrayList<>();
        vertexArrayList = new ArrayList<>();
        Vertex.setMaxId(0);

        return "index";
    }

    @RequestMapping("/new-vertex")
    ModelAndView newVertex(@RequestParam("x") int x, @RequestParam("y") int y){
        ModelAndView modelAndView = new ModelAndView("index::vertexListFragment");

        Vertex vertex = new Vertex(x, y, 20);
        vertexArrayList.add(vertex);

        modelAndView.addObject("vertexList", vertexArrayList);

        return modelAndView;
    }

    Vertex findVertexById(int findId){
        for (Vertex elem: vertexArrayList) {
            if (elem.getId() == findId)
                return elem;
        }
        return null;
    }

    @RequestMapping("/new-line")
    ModelAndView newLine(@RequestParam("vertex1_id") int vertex1Id, @RequestParam("vertex2_id") int vertex2d){
        ModelAndView modelAndView = new ModelAndView("index::lineListFragment");

        lineArcOrEdges.add(
                new LineArcOrEdge(findVertexById(vertex1Id), findVertexById(vertex2d))
        );

        modelAndView.addObject("lineList", lineArcOrEdges);

        return modelAndView;
    }



}
