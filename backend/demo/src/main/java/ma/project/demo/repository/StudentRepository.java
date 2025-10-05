package ma.project.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ma.project.demo.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
}

