package edu.wisc.my.profile.local.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.wisc.my.profile.local.dao.LocalUserDao;
import edu.wisc.my.profile.model.User;


public class LocalUserDaoImpl implements LocalUserDao {
    
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @SuppressWarnings("unchecked")
    @Override
    public List<User> getUsersBySearchTerm(String searchTerm){
        if(searchTerm == null){
            searchTerm = "";
        }
        ObjectMapper mapper = new ObjectMapper();
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("users.json").getFile());
        List<User> listUsers = new ArrayList<User>();
        try {
            listUsers = mapper.readValue(file, new TypeReference<ArrayList<User>>() {});
        } catch (Exception e) {
            logger.error("Issue during search for users", e);
        }
        List<User> filteredUsers = new ArrayList<User>();
        for(User u: listUsers){
            if(searchTerm.equalsIgnoreCase(u.getUid()) || searchTerm.equalsIgnoreCase(u.getSn())){
                filteredUsers.add(u);
            }
        }
        Collections.sort(filteredUsers);
        return filteredUsers;
    }
}