package unoeste.fipp.mercadofipp.db.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "anuncio")
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anu_id")
    private Long id;

    @Column(name = "anu_title")
    private String title;

    @Column(name = "anu_date")
    private LocalDate date;

    @Column(name = "anu_desc")
    private String descr;

    @Column(name = "anu_price")
    private double price;

    @ManyToOne
    @JoinColumn(name = "cat_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "usr_id", nullable = false)
    private User user;

    @Column(name = "anu_image")
    private String image;






    @OneToMany(mappedBy = "ad")
    private List<Pergunta> perguntas;

    public Ad(Long id, String title, LocalDate date, String descr, double price, String image, Category category, User user, List<Pergunta> perguntas) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.descr = descr;
        this.price = price;
        this.image = image;
        this.category = category;
        this.user = user;
        this.perguntas = perguntas;
    }

    public Ad() {
        this(0L, "", LocalDate.now(), "", 0,"", null, null, null);
    }

    public Long getId() {
        return id; // Ajustado para 'id'
    }

    public void setId(Long id) {
        this.id = id; // Ajustado para 'id'
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescr() {
        return descr;
    }

    public void setDescr(String descr) {
        this.descr = descr;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Pergunta> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<Pergunta> perguntas) {
        this.perguntas = perguntas;
    }
}
