package unoeste.fipp.mercadofipp.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.mercadofipp.db.entity.User;
import unoeste.fipp.mercadofipp.db.repository.UserRepository;
import unoeste.fipp.mercadofipp.infra.security.TokenService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="access/")
public class AccessRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;


    @PostMapping(value="/register")
    public ResponseEntity<String> register(@RequestBody User user){
        if(userRepository.findByName(user.getName())!=null)
            return ResponseEntity.badRequest().body("This user exist");

        userRepository.save(user);
        return ResponseEntity.ok("User registered");
    }



    @PostMapping(value = "/login")
    public ResponseEntity<Object> login(@RequestBody User login)
    {
        User user = userRepository.findByName(login.getName());

        if (user!=null && login.getPass().equals(user.getPass()))
            return ResponseEntity.ok(tokenService.generateToken(user));
        else
            return ResponseEntity.badRequest().body("User or password is invalid");
    }


    @GetMapping(value = "/teste")
    public List<User> getAllUser(@RequestParam(required = false) String filter) {
        List<User> userList;
        if (filter == null || filter.isEmpty())
            userList = userRepository.findAll();
        else
            userList = userRepository.findWithFilter(filter.toLowerCase());

        return userList;
    }


    @GetMapping(value = "/getInfoUser")
    public ResponseEntity<?> getInfoUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Remove o prefixo "Bearer " do token
            String token = authorizationHeader.replace("Bearer ", "");

            // Usa o TokenService para extrair as informações do token
            Map<String, String> userInfo = tokenService.extractInfoFromToken(token);

            return ResponseEntity.ok().body(userInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
