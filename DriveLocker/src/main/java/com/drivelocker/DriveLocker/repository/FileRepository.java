package com.drivelocker.DriveLocker.repository;

import com.drivelocker.DriveLocker.models.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

    List<File> findByUserEmail(String email);



    @Modifying
    @Transactional
    @Query("DELETE FROM File f WHERE f.publicId IN :publicIds AND f.user.email = :email")
    void deleteByPublicIdsAndUserEmail(@Param("publicIds") List<String> publicIds,
                                       @Param("email") String email);

}
