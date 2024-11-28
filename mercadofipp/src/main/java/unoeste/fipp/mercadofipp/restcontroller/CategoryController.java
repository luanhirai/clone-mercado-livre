package unoeste.fipp.mercadofipp.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unoeste.fipp.mercadofipp.db.entity.Category;
import unoeste.fipp.mercadofipp.db.repository.CategoryRepository;
import unoeste.fipp.mercadofipp.service.CatService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value="apis/cat")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CatService catService;

    @GetMapping(value="/getCat")
    public ResponseEntity<Object> getCat(){
        return ResponseEntity.ok(catService.getAll());
    }
}
