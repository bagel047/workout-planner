package mk.ukim.finki.workoutplanner.service.implementation;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.workoutplanner.model.entity.User;
import mk.ukim.finki.workoutplanner.model.enums.AuthProvider;
import mk.ukim.finki.workoutplanner.model.enums.Role;
import mk.ukim.finki.workoutplanner.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        String providerId;
        String email;
        String displayName;
        String avatarUrl;

        if (provider == AuthProvider.GOOGLE) {
            providerId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email");
            displayName = oAuth2User.getAttribute("name");
            avatarUrl = oAuth2User.getAttribute("picture");
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> createOAuth2User(provider, providerId, email, displayName, avatarUrl));

        // update display info in case it changed on the provider side
        user.setDisplayName(displayName);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return oAuth2User;
    }

    private User createOAuth2User(AuthProvider provider, String providerId,
                                  String email, String displayName, String avatarUrl) {

        String baseUsername = email != null ? email.split("@")[0] : providerId;
        String username = baseUsername;

        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + suffix++;
        }

        User user = User.builder()
                .provider(provider)
                .providerId(providerId)
                .email(email)
                .username(username)
                .displayName(displayName != null ? displayName : username)
                .avatarUrl(avatarUrl)
                .role(Role.ROLE_USER)
                .build();
        return userRepository.save(user);
    }
}
