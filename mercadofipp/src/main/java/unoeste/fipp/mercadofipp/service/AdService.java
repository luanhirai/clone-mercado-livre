package unoeste.fipp.mercadofipp.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unoeste.fipp.mercadofipp.db.entity.Ad;
import unoeste.fipp.mercadofipp.db.entity.Pergunta;
import unoeste.fipp.mercadofipp.db.repository.AdRepository;
import unoeste.fipp.mercadofipp.db.repository.QuestionRepository;

import java.util.List;

@Service
public class AdService {
    @Autowired
    private AdRepository adRepository;

    @Autowired
    private QuestionRepository questionRepository;



    public Ad getAd(Long id) {
        Ad ad = adRepository.findById(id).get();
        return ad;
    }

    public List<Ad> getAll(String filter){
        List<Ad> adList;
        if(filter.isEmpty())
            adList= adRepository.findAll();
        else
            adList=adRepository.findWithFilter(filter.toLowerCase());
        return adList;
    }

    @Transactional
    public boolean delAd(Long id)
    {
        try {
            questionRepository.deleteByAd_Id(id);
            System.out.println("chega aqui?");
            adRepository.deleteById(id);
            return true;
        }catch (Exception e) {
            return false;
        }
    }

    public Ad saveAd(Ad ad) {
        return adRepository.save(ad);
    }


    public Pergunta addQuestion(Pergunta pergunta){
        try{
            pergunta=questionRepository.save(pergunta);
        }
        catch(Exception e){
            pergunta=null;
        }
        return pergunta;
    }









}
