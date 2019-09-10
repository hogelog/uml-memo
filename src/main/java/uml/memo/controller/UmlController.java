package uml.memo.controller;

import net.sourceforge.plantuml.SourceStringReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class UmlController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UmlController.class);
    private static final String DEFAULT_UML = "@startuml\nBob -> Alice: hello\n@enduml";

    @RequestMapping(value = "/uml/image", method = GET, produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] image(@RequestParam(value="uml", defaultValue=DEFAULT_UML) String uml) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        SourceStringReader reader = new SourceStringReader(uml);
        String description = reader.generateImage(buffer);
        LOGGER.info(description);
        return buffer.toByteArray();
    }
}
