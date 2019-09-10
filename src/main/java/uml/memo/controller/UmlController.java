package uml.memo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uml.memo.service.UmlService;

import java.io.IOException;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class UmlController {
    @Autowired
    UmlService umlService;

    @GetMapping(path = "/uml/source/{encoded}", produces = MediaType.TEXT_PLAIN_VALUE)
    public String uml(@PathVariable String encoded) throws IOException {
        return umlService.decode(encoded);
    }

    @GetMapping(path = "/uml/{encoded}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] image(@PathVariable String encoded) throws IOException {
        String uml = umlService.decode(encoded);
        return umlService.generateImage(uml);
    }
}
