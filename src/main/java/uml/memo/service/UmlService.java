package uml.memo.service;

import net.sourceforge.plantuml.FileFormat;
import net.sourceforge.plantuml.FileFormatOption;
import net.sourceforge.plantuml.SourceStringReader;
import net.sourceforge.plantuml.code.TranscoderUtil;
import net.sourceforge.plantuml.core.DiagramDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.DigestUtils;
import org.springframework.util.StreamUtils;
import uml.memo.controller.UmlController;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.InflaterInputStream;

@Service
public class UmlService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UmlController.class);

    @Autowired
    MemcachedService memcachedService;

    public String encode(String uml) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION);
        try (DeflaterOutputStream comp = new DeflaterOutputStream(buffer, deflater)) {
            StreamUtils.copy(uml, StandardCharsets.UTF_8, comp);
            comp.flush();
        }
        byte[] compressed = buffer.toByteArray();
        return Base64Utils.encodeToUrlSafeString(compressed);
    }

    public String decode(String encoded) throws IOException {
        byte[] compressed = Base64Utils.decodeFromUrlSafeString(encoded);
        new ByteArrayInputStream(compressed);
        try (InflaterInputStream decomp = new InflaterInputStream(new ByteArrayInputStream(compressed))) {
            return StreamUtils.copyToString(decomp, StandardCharsets.UTF_8);
        }
    }

    public String decodePlantUmlString(String encoded) throws IOException {
        return TranscoderUtil.getDefaultTranscoder().decode(encoded);
    }

    public byte[] decodeImageWithCache(String encodedUml, FileFormat format, boolean isPlantUmlEncode) throws IOException, MemcachedService.Exception {
        String key = "uml:" + format.name() + ":" + isPlantUmlEncode + ":" + DigestUtils.md5DigestAsHex(encodedUml.getBytes(StandardCharsets.UTF_8));
        Optional<byte[]> cache = memcachedService.get(key);
        if (cache.isPresent()) {
            return cache.get();
        }
        String uml = isPlantUmlEncode ? decodePlantUmlString(encodedUml) : decode(encodedUml);
        byte[] image = generateImage(uml, format);
        memcachedService.put(key, image);
        return image;
    }

    public byte[] generateImage(String uml, FileFormat format) throws IOException {
        try (ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            SourceStringReader reader = new SourceStringReader(uml);
            DiagramDescription diagram = reader.outputImage(buffer, 0, new FileFormatOption(format));
            LOGGER.info(diagram.getDescription());
            return buffer.toByteArray();
        }
    }
}
