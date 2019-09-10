package uml.memo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import uml.memo.service.UmlService;

import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

@CrossOrigin
@RestController
public class ApiUmlController {
    @Autowired
    UmlService umlService;

    @PostMapping(path = "/api/uml", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> uml(@RequestParam String uml) throws IOException {
        Map<String, String> data = new TreeMap<>();
        data.put("encoded", umlService.encode(uml));
        return data;
    }
}
