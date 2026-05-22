package mk.ukim.finki.workoutplanner.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.config.JwtUtil;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    @SuppressWarnings("DataFlowIssue")
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            getRedirectStrategy().sendRedirect(request, response,
                    "http://localhost:5173/oauth2/error?message=Email+not+provided+by+OAuth2+provider");
            return;
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            getRedirectStrategy().sendRedirect(request, response,
                    "http://localhost:5173/oauth2/error?message=User+not+found");
            return;
        }

        // redirect to react frontend with JWT token as query param
        String token = jwtUtil.generateToken(user);
        getRedirectStrategy().sendRedirect(request, response,
                "http://localhost:5173/oauth2/callback?token=" + token);
    }
}
