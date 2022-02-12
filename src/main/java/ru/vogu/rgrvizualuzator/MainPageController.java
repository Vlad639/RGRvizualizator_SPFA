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

    @RequestMapping("/")
    String index(){
        return "index";
    }

    @RequestMapping("/new-vertex")
    ModelAndView newVertex(@RequestParam("x") int x, @RequestParam("y") int y){
        ModelAndView modelAndView = new ModelAndView("index::test");

        Vertex vertex = new Vertex(x, y, 20, 0);
        vertexArrayList.add(vertex);

        modelAndView.addObject("vertexList", vertexArrayList);

        return modelAndView;
    }

    @RequestMapping("/update-vertex")
    ModelAndView updateVertex(@RequestParam("vertexList[]") List<Integer> vertexList){
        ModelAndView modelAndView = new ModelAndView("index::test");

        for (int vertextId: vertexList) {
            for (Vertex vertex: vertexArrayList) {
                if (vertex.getId() == vertextId){
                    vertex.setSelected(!vertex.isSelected());
                }
            }
        }

        modelAndView.addObject("vertexList", vertexArrayList);

        return modelAndView;
    }


}
