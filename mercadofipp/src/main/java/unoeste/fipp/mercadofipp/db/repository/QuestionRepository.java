package unoeste.fipp.mercadofipp.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import unoeste.fipp.mercadofipp.db.entity.Pergunta;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Pergunta, Long> {
    List<Pergunta> findByAdId(Long adId);  // Retorna uma lista de perguntas

    void deleteByAd_Id(Long id);  // Corrigido: Comparando o ID do anúncio, não o objeto
}
