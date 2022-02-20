interface RefreshTokenResponse {
    user_id: string;
    token: string;
    created_at: Date;
    expiry_at: Date;
    active: boolean;
  }
  