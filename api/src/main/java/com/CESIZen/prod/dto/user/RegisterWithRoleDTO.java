package com.CESIZen.prod.dto.user;

import com.CESIZen.prod.entity.RoleEnum;
import jakarta.validation.constraints.NotNull;

public class RegisterWithRoleDTO extends RegisterDTO {

    @NotNull(message = "Le rôle ne peut pas être nul")
    private RoleEnum role;

    public RoleEnum getRole() {
        return role;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }
}