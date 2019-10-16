package uml.memo.controller;

import net.sourceforge.plantuml.FileFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import uml.memo.service.MemcachedService;
import uml.memo.service.UmlService;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class UmlController {
    private static final String IMAGE_SVG_VALUE = "image/svg+xml";

    @Autowired
    UmlService umlService;

    @GetMapping(path = "/uml/source/{encoded}", produces = MediaType.TEXT_PLAIN_VALUE)
    public String uml(@PathVariable String encoded) throws IOException {
        return umlService.decode(encoded);
    }

    @GetMapping(path = { "/uml/{encoded}", "/uml/{encoded}.png" }, produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] image(@PathVariable String encoded) throws IOException, MemcachedService.Exception {
        return umlService.decodeImageWithCache(encoded, FileFormat.PNG);
    }

    @GetMapping(path = "/uml/{encoded}.svg", produces = IMAGE_SVG_VALUE)
    public byte[] imageSvg(@PathVariable String encoded) throws IOException, MemcachedService.Exception {
        return umlService.decodeImageWithCache(encoded, FileFormat.SVG);
    }

    @GetMapping(path = "/uml/{encoded}.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String imageTxt(@PathVariable String encoded) throws IOException, MemcachedService.Exception {
        byte[] bytes = umlService.decodeImageWithCache(encoded, FileFormat.UTXT);
        return new String(bytes, StandardCharsets.UTF_8);
    }

    @GetMapping(path = "/uml/{encoded}.atxt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String imageAsciiTxt(@PathVariable String encoded) throws IOException, MemcachedService.Exception {
        byte[] bytes = umlService.decodeImageWithCache(encoded, FileFormat.ATXT);
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
