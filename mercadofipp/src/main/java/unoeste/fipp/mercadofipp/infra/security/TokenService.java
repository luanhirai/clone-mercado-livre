package unoeste.fipp.mercadofipp.infra.security;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import unoeste.fipp.mercadofipp.db.entity.User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        System.out.println("Nome : "+user.getName()+ " id: "+user.getId()+ " level"+user.getLevel());
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("auth-api")
                    .withClaim("name", (user.getName()))
                    .withClaim("level", String.valueOf(user.getLevel()))
                    .withClaim("id", (user.getId()))
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm); // Gera o token como String

        } catch (JWTCreationException e) {
            throw new RuntimeException("Error generating token", e);
        }
    }


    public String validateToken(String token) {
        try{
            Algorithm algorithm= Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)// descriptografou o token
                    .getSubject(); //pegou o subject

        } catch(JWTVerificationException e){
            return "";
        }
    }


    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }


    public Map<String, String> extractInfoFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var decodedToken = JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token);

            // Extraindo as informações do token
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("name", decodedToken.getClaim("name").asString());
            userInfo.put("level", decodedToken.getClaim("level").asString());
            userInfo.put("id", String.valueOf(decodedToken.getClaim("id")));

            return userInfo;
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Invalid or expired token", e);
        }
    }


}
