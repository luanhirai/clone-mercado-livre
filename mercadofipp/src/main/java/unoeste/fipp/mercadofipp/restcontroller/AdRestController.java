package unoeste.fipp.mercadofipp.restcontroller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import unoeste.fipp.mercadofipp.db.entity.Ad;
import unoeste.fipp.mercadofipp.db.entity.Pergunta;
import unoeste.fipp.mercadofipp.db.repository.AdRepository;
import unoeste.fipp.mercadofipp.db.repository.QuestionRepository;
import unoeste.fipp.mercadofipp.service.AdService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(value="apis/ad")
@CrossOrigin(origins = "http://localhost:5173")
public class AdRestController {

    @Autowired
    AdService adService;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    AdRepository adRepository;


    private static final String UPLOAD_DIR = Paths.get("").toAbsolutePath().toString()+"\\src\\main\\resources\\imagens\\";
    @Autowired
    private QuestionRepository questionRepository;


    @GetMapping(value="/teste")
    public String teste(){
        return Paths.get("").toAbsolutePath().toString();
    }

    @GetMapping(value="/get-one")
    public ResponseEntity<Object> getOne(@RequestParam Long id) {
        Ad ad=adService.getAd(id);

        if(ad!=null)
            return ResponseEntity.ok(ad);
        else
            return ResponseEntity.badRequest().body("erro");
    }


    @GetMapping(value = "/get-one-image")
    public ResponseEntity<Object> getOneImage(@RequestParam Long id) {
        Ad ad = adService.getAd(id);

        if (ad != null) {
            String imageName = ad.getImage();

            Path imagePath = Path.of(imageName);

            File imageFile = imagePath.toFile();
            if (imageFile.exists()) {
                try {
                    byte[] imageBytes = Files.readAllBytes(imagePath);
                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_JPEG)
                            .body(imageBytes);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao ler a imagem.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Imagem não encontrada.");
            }
        } else {
            return ResponseEntity.badRequest().body("Anúncio não encontrado.");
        }
    }




    @GetMapping(value="/get-many")
    public ResponseEntity<Object> getMany() {
        System.out.println("Recebendo requisição para 'get-many'");
        return ResponseEntity.ok(adService.getAll(""));
    }


    @GetMapping(value="/get-with-filter")
    public ResponseEntity<Object> getWithFilter(String filtro) {
        return ResponseEntity.ok(adService.getAll(filtro));
    }

    @PostMapping(value="/add")
    public ResponseEntity<Object> addAd(@RequestParam("ad") String adJson,
                                        @RequestParam("image") MultipartFile image) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Ad ad = objectMapper.readValue(adJson, Ad.class);

            if (ad.getId() != null && ad.getId() > 0) {
                Optional<Ad> existingAd = adRepository.findById(ad.getId());
                if (existingAd.isPresent()) {
                    ad = existingAd.get();
                    String filename = saveImage(image);
                    ad.setImage(UPLOAD_DIR + filename);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Anúncio não encontrado para atualização.");
                }
            } else {
                ad.setDate(LocalDate.now());

                String filename = saveImage(image);
                ad.setImage(UPLOAD_DIR + filename);
            }

            adService.saveAd(ad);

            return ResponseEntity.ok(ad);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar o anúncio e/ou imagem.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado.");
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, filename);

        Files.createDirectories(Paths.get(UPLOAD_DIR));


        image.transferTo(path.toFile());
        return filename;
    }



    @PostMapping(value="/add-question")
    public ResponseEntity<Object> addQuestion(@RequestBody Pergunta pergunta) {
        pergunta = adService.addQuestion(pergunta);
        if(pergunta!=null)
            return ResponseEntity.ok(pergunta);
        else
            return ResponseEntity.badRequest().body("Erro");
    }

    @GetMapping("/get-questions")
    public ResponseEntity<List<Pergunta>> getQuestionsByAdId(@RequestParam Long adId) {
        try {

            List<Pergunta> perguntas = questionRepository.findByAdId(adId);
            return ResponseEntity.ok(perguntas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    @PostMapping(value="/delete")
    public ResponseEntity<Object> delete(Long id)
    {
        if(adService.delAd(id)){
            System.out.println("E AQUI?");
            return ResponseEntity.ok("ok");
        }
        else
            return ResponseEntity.badRequest().body("erro");
    }



}
