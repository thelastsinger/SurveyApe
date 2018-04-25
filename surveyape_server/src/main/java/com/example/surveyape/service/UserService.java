package com.example.surveyape.service;

import com.example.surveyape.entity.User;
import com.example.surveyape.repository.UserRepository;
import com.example.surveyape.utils.UserUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User saveUser(User user){
        User user1 = null;
        try{
            user1 = userRepository.save(user);
        }
        catch (Exception e){
            throw e;
        }
        return user;
    }

    public User findByEmailAndPassword(String email, String password){
        User user = null;
        try{
            user = userRepository.findByEmailAndPassword(email, password);
        }
        catch (Exception e){
            throw e;
        }
        return user;
    }

    public User findByEmail(String email){
        User user = null;
        try{
            user = userRepository.findByEmail(email);
        }
        catch (Exception e){
            throw e;
        }
        return user;
    }

    public User registerUser(User user){
        try{
            System.out.println(user+" user email: "+user.getEmail());
            System.out.println(userRepository.findByEmail(user.getEmail()));
            if(userRepository.findByEmail(user.getEmail())==null) {
                userRepository.save(user);
            }
        }
        catch (Exception e){
            throw e;
        }
        return user;
    }

    public Integer verifyUserAccount(Integer code){
        User user = userRepository.findByVerificationcode(code);
        if(user == null){
            return UserUtility.USER_NOT_FOUND;
        }else if(user.getVerified()){
            return UserUtility.ALREADY_VERIFIED;
        }else{
            user.setVerified(true);
            userRepository.save(user);
            return UserUtility.SUCCESSFULLY_VERIFIED;
        }

    }
}

