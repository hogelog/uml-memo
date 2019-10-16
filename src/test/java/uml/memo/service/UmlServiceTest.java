package uml.memo.service;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UmlServiceTest {
    @Autowired
    UmlService service;

    private static final String SAMPLE_UML = "@startuml\nBob -> Alice : hello\n@enduml";
    private static final String SAMPLE_ENCODED = "eNpzKC5JLCopzc3hcspPUtC1U3DMyUxOVbBSyEjNycnnckjNSwFKAgD4CQzA";

    @Test
    public void encode() throws Exception {
        assertThat(service.encode(SAMPLE_UML), is(SAMPLE_ENCODED));
    }

    @Test
    public void decode() throws Exception {
        assertThat(service.decode(SAMPLE_ENCODED), is(SAMPLE_UML));
    }
}
