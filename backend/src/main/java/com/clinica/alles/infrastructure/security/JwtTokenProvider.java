package com.clinica.alles.infrastructure.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Componente responsável por gerar, validar e extrair informações de tokens JWT.
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Gera um token JWT para o usuário.
     *
     * @param email email do usuário
     * @param perfil perfil do usuário
     * @return token JWT gerado
     */
    public String generateToken(String email, String perfil) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("perfil", perfil);
        return createToken(claims, email, jwtExpiration);
    }

    /**
     * Gera um token de refresh.
     *
     * @param email email do usuário
     * @return token de refresh
     */
    public String generateRefreshToken(String email) {
        return createToken(new HashMap<>(), email, refreshExpiration);
    }

    /**
     * Cria um token JWT com os dados fornecidos.
     *
     * @param claims mapa com claims customizados
     * @param subject email do usuário
     * @param expiration tempo de expiração em milissegundos
     * @return token JWT
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Valida um token JWT.
     *
     * @param token token a validar
     * @return true se válido, false caso contrário
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            log.error("Erro ao validar JWT: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Extrai o email do token JWT.
     *
     * @param token token JWT
     * @return email extraído
     */
    public String getEmailFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.getSubject();
    }

    /**
     * Extrai o perfil do token JWT.
     *
     * @param token token JWT
     * @return perfil extraído
     */
    public String getPerfilFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return (String) claims.get("perfil");
    }

    /**
     * Verifica se um token expirou.
     *
     * @param token token JWT
     * @return true se expirado, false caso contrário
     */
    public Boolean isTokenExpired(String token) {
        try {
            Date expiration = getAllClaimsFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    /**
     * Extrai todas as claims de um token JWT.
     *
     * @param token token JWT
     * @return claims contidas no token
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extrai o token JWT da string "Bearer token".
     *
     * @param bearerToken string contendo "Bearer token"
     * @return token JWT ou null
     */
    public String extractTokenFromBearerString(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
