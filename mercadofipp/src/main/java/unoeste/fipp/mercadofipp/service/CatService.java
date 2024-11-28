package unoeste.fipp.mercadofipp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unoeste.fipp.mercadofipp.db.entity.Ad;
import unoeste.fipp.mercadofipp.db.entity.Category;
import unoeste.fipp.mercadofipp.db.repository.CategoryRepository;

import java.util.List;

@Service
public class CatService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll(){
        List<Category> catList;
        catList= categoryRepository.findAll();
        return catList;
    }
}
