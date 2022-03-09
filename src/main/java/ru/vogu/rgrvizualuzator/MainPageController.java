package ru.vogu.rgrvizualuzator;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainPageController {

    @RequestMapping("/")
    String index() {
        return "index";
    }

}
