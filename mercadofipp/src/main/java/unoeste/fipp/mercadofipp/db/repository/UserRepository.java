package unoeste.fipp.mercadofipp.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import unoeste.fipp.mercadofipp.db.entity.Ad;
import unoeste.fipp.mercadofipp.db.entity.User;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long> {
    User findByName(String name);

    @Query(value="SELECT * FROM usuario WHERE lower(anu_title) LIKE %:filter% or lower(usr_name) LIKE %:filter%",nativeQuery=true)
    List<User> findWithFilter(@Param("filter")String filter);

}
